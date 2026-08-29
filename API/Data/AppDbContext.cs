using GymApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GymApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<PersonalTrainer> PersonalTrainers => Set<PersonalTrainer>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<PlanoDeTreino> PlanosDeTreino => Set<PlanoDeTreino>();
    public DbSet<DiaDeTreino> DiasDeTreino => Set<DiaDeTreino>();
    public DbSet<ExercicioDoDia> ExerciciosDoDia => Set<ExercicioDoDia>();
    public DbSet<RegistroExecucaoTreino> RegistrosExecucaoTreino => Set<RegistroExecucaoTreino>();
    public DbSet<RegistroCargaExercicio> RegistrosCargaExercicio => Set<RegistroCargaExercicio>();
    public DbSet<RegistroProgresso> RegistrosProgresso => Set<RegistroProgresso>();
    public DbSet<MedidaCorporal> MedidasCorporais => Set<MedidaCorporal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // PersonalTrainer e Cliente compartilham a PK com Usuario (relação 1:1)
        modelBuilder.Entity<PersonalTrainer>()
            .HasOne(p => p.Usuario)
            .WithOne()
            .HasForeignKey<PersonalTrainer>(p => p.Id);

        modelBuilder.Entity<Cliente>()
            .HasOne(c => c.Usuario)
            .WithOne()
            .HasForeignKey<Cliente>(c => c.Id);

        modelBuilder.Entity<Cliente>()
            .HasOne(c => c.PersonalTrainer)
            .WithMany(p => p.Clientes)
            .HasForeignKey(c => c.PersonalTrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PlanoDeTreino>()
            .HasOne(p => p.Cliente)
            .WithMany()
            .HasForeignKey(p => p.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PlanoDeTreino>()
            .HasOne(p => p.PersonalTrainer)
            .WithMany()
            .HasForeignKey(p => p.PersonalTrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DiaDeTreino>()
            .HasOne(d => d.PlanoDeTreino)
            .WithMany(p => p.Dias)
            .HasForeignKey(d => d.PlanoDeTreinoId);

        modelBuilder.Entity<ExercicioDoDia>()
            .HasOne(e => e.DiaDeTreino)
            .WithMany(d => d.Exercicios)
            .HasForeignKey(e => e.DiaDeTreinoId);

        modelBuilder.Entity<RegistroExecucaoTreino>()
            .HasOne(r => r.Cliente)
            .WithMany()
            .HasForeignKey(r => r.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RegistroExecucaoTreino>()
            .HasOne(r => r.DiaDeTreino)
            .WithMany()
            .HasForeignKey(r => r.DiaDeTreinoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RegistroCargaExercicio>()
            .HasOne(r => r.RegistroExecucaoTreino)
            .WithMany(r => r.Cargas)
            .HasForeignKey(r => r.RegistroExecucaoTreinoId);

        modelBuilder.Entity<RegistroCargaExercicio>()
            .HasOne(r => r.ExercicioDoDia)
            .WithMany()
            .HasForeignKey(r => r.ExercicioDoDiaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RegistroProgresso>()
            .HasOne(r => r.Cliente)
            .WithMany()
            .HasForeignKey(r => r.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MedidaCorporal>()
            .HasOne(m => m.RegistroProgresso)
            .WithMany(r => r.Medidas)
            .HasForeignKey(m => m.RegistroProgressoId);

        // Precisão dos campos decimais
        modelBuilder.Entity<Cliente>().Property(c => c.AlturaCm).HasPrecision(5, 2);
        modelBuilder.Entity<ExercicioDoDia>().Property(e => e.CargaSugeridaKg).HasPrecision(6, 2);
        modelBuilder.Entity<RegistroCargaExercicio>().Property(r => r.CargaUtilizadaKg).HasPrecision(6, 2);
        modelBuilder.Entity<RegistroProgresso>().Property(r => r.PesoKg).HasPrecision(5, 2);
        modelBuilder.Entity<RegistroProgresso>().Property(r => r.PercentualGordura).HasPrecision(4, 2);
        modelBuilder.Entity<MedidaCorporal>().Property(m => m.ValorCm).HasPrecision(5, 2);
    }
}
